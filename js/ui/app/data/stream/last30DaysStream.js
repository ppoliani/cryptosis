import {createAction} from 'redux-actions'
import {combine, fromPromise} from 'most'
import {fromJS, Map} from 'immutable'
import subDays from 'date-fns/sub_days'
import {partial} from '../../../../common/core/fn'
import {calculateHistoricPortfolioValues} from '../../../../common/aggregators'
import {convertToBaseCurrency} from '../../../../common/fx'
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
  // This creates a list similar to the one we would get from the historic price source
  // but the price for the current currency will be 1;
  // The reason we're doing that is that our source will send an error if we ask prices for 
  // the same trading pair i.e. GBP/GBP.  But we still need to have that entry to calculate 
  // the portfolio metrics later on.
  const normalizePriceList = (priceList) => {
    // get from a successufll response so we use the correct day timestamps
    const data = priceList.filter(p => p.Response === 'Success')[0].Data;
    return {
      Data: data.map(d => ({open: 1, time: d.time}))
    }
  }

  const getPriceObj = (asset, response) => fromJS(
    response.Data.map(i => ({
      price: i.open, 
      market: '',
      asset,
      day: i.time * 1000 // unix time to js
    }))
  )

  const extractTxns = (txns, fx)  => fromJS(txns.result);
  
  const getPrices = ({txns, distinctAssets}, ...priceList) => {
    const priceObjReducer =  (acc, pl, index) => {
      const asset = distinctAssets.get(index);
      return asset === currency
        ? acc.set(asset, getPriceObj(asset, normalizePriceList(priceList)))
        : acc.set(asset, getPriceObj(asset, pl));
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

  const subscription = combine(extractTxns, getPartialTransactions$(), fx$(currency))
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
