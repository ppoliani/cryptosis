import {fromPromise, combine, mergeArray} from 'most'
import {fromJS, Map, Set} from 'immutable'
import {identity} from 'folktale/core/lambda'
import fetch from '../../services/api'
import {convertToBaseCurrency} from '../../../../common/fx'
import {majorPriceStream$} from '../../../../common/sockets/streams'

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) => `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}&tryConversion=true`
const fxUrl = base => `http://api.fixer.io/latest?base=${base}&symbols=${getSymbolsExceptFor(base).join(',')}`;
const priceUrl = (currency, symbol) => `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${currency}`


const getSymbolsExceptFor = currency => ['GBP', 'EUR', 'USD'].filter(c => c !== currency);

const fetchPartialInvestments = fetch('GET', `${INVESTMENT_ENDPOINT}/partial`);
const fetchFX = currency => fetch('GET', fxUrl(currency), {}, false);
const fetchHistoricData = (currency, symbol) => fetch('GET', historicalDataUrl(symbol, currency, +(new Date), 30), {}, false);
const fetchPrice = (currency, symbol) => fetch('GET', priceUrl(currency, symbol), {}, false)

export const createPriceStreams$ = (currency, symbols) => symbols
  .map(s => fetchPrice(currency, s).run().promise())

export const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.run().promise())

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

export const getDistinctInvestmentTypes = investments => investments
  .reduce(
    (acc, investment) => acc.add(investment.get('investmentType')), 
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

