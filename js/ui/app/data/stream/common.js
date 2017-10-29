import {fromPromise, combine, mergeArray} from 'most'
import {fromJS, Map} from 'immutable'
import {identity} from 'folktale/core/lambda'
import fetch from '../../services/api'
import {convertToBaseCurrency} from '../../../../common/fx'
import {majorPriceStream$} from '../../../../common/sockets/streams'

const INVESTMENT_ENDPOINT = `${process.env.API_URL}/investments`;

const historicalDataUrl = (fromSymbol, toSymbol, timestamp, days) =>
  `https://min-api.cryptocompare.com/data/histoday?fsym=${fromSymbol}&tsym=${toSymbol}&limit=${days}&aggregate=1&toTs=${timestamp}`

  const fxUrl = base =>
  `http://api.fixer.io/latest?base=${base}&symbols=${getSymbolsExceptFor(base).join(',')}`;

const getSymbolsExceptFor = currency => ['GBP', 'EUR', 'USD'].filter(c => c !== currency);

const fetchPartialInvestments = fetch('GET', `${INVESTMENT_ENDPOINT}/partial`);
const fetchBTC = currency => fetch('GET', historicalDataUrl('BTC', currency, +(new Date), 30), {}, false);
const fetchBCH = currency => fetch('GET', historicalDataUrl('BCH', currency, +(new Date), 30), {}, false);
const fetchETH = currency => fetch('GET', historicalDataUrl('ETH', currency, +(new Date), 30), {}, false);
const fetchXRP = currency => fetch('GET', historicalDataUrl('XRP', currency, +(new Date), 30), {}, false);
const fetchXTZ = currency => fetch('GET', historicalDataUrl('XTZ', currency, +(new Date), 30), {}, false);
const fetchFX = currency => fetch('GET', fxUrl(currency), {}, false);

export const getBTC$ = currency => fromPromise(fetchBTC(currency).run().promise())
export const getBCH$ = currency => fromPromise(fetchBCH(currency).run().promise())
export const getETH$ = currency => fromPromise(fetchETH(currency).run().promise())
export const getXRP$ = currency => fromPromise(fetchXRP(currency).run().promise())
export const getXTZ$ = currency => fromPromise(fetchXTZ(currency).run().promise())
export const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.run().promise())

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

export const fx$ = currency => combine(
    extractData,
    majorPriceStream$(currency),
    fromPromise(fetchFX('GBP').run().promise()),
    fromPromise(fetchFX('EUR').run().promise()),
    fromPromise(fetchFX('USD').run().promise())
  )
  .scan(extendWithCryptoPrices, Map())
  .skipWhile(fx => fx.size === 0);

export const getPriceObjFromStreamData = (currency, fx, data) => ({
  price: convertToBaseCurrency(currency, data.TOSYMBOL, data.PRICE, fx.get(currency)),
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

