import {createAction} from 'redux-actions'
import {combine, fromPromise} from 'most'
import {fromJS, Map} from 'immutable'
import {partial} from '../../../../common/core/fn'
import {calculateHistoricPortfolioValues} from '../../../../common/aggregators'
import {changePriceToSelectedCurrency, convertToBaseCurrency} from '../../../../common/fx'
import {MINUTE} from '../../../../common/constants/time'
import {setLast30Days} from '../portfolio/portfolioActions'
import {getPartialTransactions$, createHistoricStreams, fx$, getDistinctAssets} from './common'

export const SET_LAST_30_DAYS_SUBSCRIPTION = 'STREAM::SET_LAST_30_DAYS_SUBSCRIPTION'
const setLast30DaysSubscription = createAction(SET_LAST_30_DAYS_SUBSCRIPTION);

export const startLast30DaysStream = currency => dispatch => {
  const observer = {
    next: (dispatch) ['∘'] (setLast30Days),
    error: errorValue => {
      console.log(`Error in the observer of the portfolio stream: ${errorValue}`)
    }
  }

  // for the current fiat currency i.e. GBP we want to normalize it so 
  // it contains 1 as the price becuase 1 GBP always costs 1 GBP 
  const getPriceObj = (asset, response) => fromJS(
    response.Data.map(i => ({
      price: i.close, 
      market: '',
      asset,
      day: i.time * 1000 // unix time to js
    }))
  )

  const updateTransactions = (txns, fx)  => fromJS(txns.result)
    .map(partial(changePriceToSelectedCurrency, currency, fx.get(currency)))
  
  const getPrices = ({txns, distinctAssets}, ...priceList) => {
    const priceObjReducer =  (acc, pl, index) => {
      const asset = distinctAssets.get(index);
      return acc.set(asset, getPriceObj(asset, pl));
    };

    return {
      txns,
      prices: priceList.reduce(priceObjReducer, Map())
    };
  } 

  const historicStreams = txns => {
    const distinctAssets = getDistinctAssets(txns);

    return {
      txns,
      distinctAssets,
      histoStreams$: createHistoricStreams(currency, distinctAssets)
    }
  }

  const subscription = combine(updateTransactions, getPartialTransactions$(), fx$(currency))
    .throttle(MINUTE)
    .map(historicStreams)
    .chain(result => combine(
        partial(getPrices, result), 
        ...result.histoStreams$
      )
    )
    .map(calculateHistoricPortfolioValues)
    .subscribe(observer)

  dispatch(setLast30DaysSubscription(subscription));
}
