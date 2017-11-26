import {fromPromise, combine, mergeArray} from 'most'
import {fromJS, Map, Set} from 'immutable'
import subDays from 'date-fns/sub_days'
import {identity} from 'folktale/core/lambda'
import fetch from '../../services/api'
import {partial, prop} from '../../../../common/core/fn'
import {convertToBaseCurrency} from '../../../../common/fx'
import {majorPriceStream$} from '../../../../common/sockets/streams'
import {setPrices} from '../prices/priceActions'
import config from '../../services/config'

const TRANSACTION_ENDPOINT = `${config.API_URL}/transactions`;

// cryptocompare accepts a specific timestamp
const getYesterday = () => parseInt(Number(subDays(new Date(), 1)) / 1000);
const shouldTryConversion = asset => !['GBP', 'EUR', 'USD'].includes(asset);
 
const historicalDataUrl = (fromSymbol, toSymbol, days) => 
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${getYesterday()}&tryConversion=true`;

const fxUrl = base => `http://api.fixer.io/latest?base=${base}&symbols=${getSymbolsExceptFor(base).join(',')}`;
const priceUrl = (currency, symbol) => `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${currency}`

const getSymbolsExceptFor = currency => ['GBP', 'EUR', 'USD'].filter(c => c !== currency);

const fetchPartialTransactions = fetch('GET', `${TRANSACTION_ENDPOINT}/partial`);
const fetchFX = currency => fetch('GET', fxUrl(currency), {}, false);
const fetchHistoricData = (currency, symbol) => fetch('GET', historicalDataUrl(symbol, currency, 30), {}, false);
const fetchPrice = (currency, symbol) => fetch('GET', priceUrl(currency, symbol), {}, false)

export const createPriceStreams$ = (currency, symbols) => symbols
  .map(s => fetchPrice(currency, s).run().promise())

export const getPartialTransactions$ = () => fromPromise(fetchPartialTransactions.run().promise())

export const createHistoricStreams = (currency, symbols) => symbols
  .map(s => 
    fromPromise(
      fetchHistoricData(currency, s).run().promise()
    )
  )

const extractData = (cryptoPrice, gbp, eur, usd) =>  ({
  GBP: gbp.rates,
  EUR: eur.rates,
  USD: usd.rates,
  cryptoPrice
});

const extendWithCryptoPrices = (acc, next) => {
  const {cryptoPrice} = next;

  const updateRates = currency => rates => acc
    .get(currency, Map())
    .merge(next[currency]);

  return ['GBP', 'EUR', 'USD']
    .reduce((acc, currency) => acc
      .updateIn(
        [currency],
        updateRates(currency)
      ), acc)
    .setIn(
      [cryptoPrice.TOSYMBOL, cryptoPrice.FROMSYMBOL], 
      1 / cryptoPrice.PRICE
    )
    .setIn(
      [cryptoPrice.FROMSYMBOL, cryptoPrice.TOSYMBOL],
      cryptoPrice.PRICE
    )
}

// Returns a list of all the assets currently in the portfolio
export const getDistinctAssets = txns => txns
  .reduce(
    (acc, txn) => acc
      .add(txn.get('buyAsset'))
      .add(txn.get('sellAsset')), 
    Set()
  )
  .toList();

export const fx$ = currency => combine(
    extractData,
    majorPriceStream$(currency),
    fromPromise(fetchFX('GBP').run().promise()),
    fromPromise(fetchFX('EUR').run().promise()),
    fromPromise(fetchFX('USD').run().promise())
  )
  .throttle(10000)
  .scan(extendWithCryptoPrices, Map())
  .skipWhile(fx => fx.size === 0);

export const getPriceObjFromStreamData = (currency, fx, data) => ({
  price: convertToBaseCurrency(currency, data.TOSYMBOL, data.PRICE, fx.get(currency)),
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

const getInitialPrices = async (currency, transactions) => {
  transactions = fromJS(transactions.result);
  const distinctTypes = getDistinctAssets(transactions);
  const streams = createPriceStreams$(currency, distinctTypes);
  const cryptoPrices = await Promise.all(streams);

  // associate each symbol with the corresponding result of the xhr request for it's price
  // i.e. the first item in the prices array corresponds to the first request that was sent to the server
  // distinctTypes[0] -> prices[0]
  const prices = distinctTypes
    .toList()
    .reduce((acc, symbol, index) => acc
      .set(symbol, fromJS({
        symbol,
        price: cryptoPrices[index][currency],
        market: 'Average' // default market from cryptocompare
      })),
      Map()
    );

  return {
    prices, 
    transactions,
    fx: prices
  }
}

// load the prices for all available asset types using get requests
// No need to unscubscribe because we getInitialPrices consist of promise streams which are disposes straightaway
export const streamInitialPrice = (dispatch, currency) => getPartialTransactions$()
  .chain((fromPromise) ['∘'] (partial(getInitialPrices, currency)))
  .tap((dispatch) ['∘'] (setPrices) ['∘'] (prop('prices')));
