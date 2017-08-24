import fetch from '../../services/api'
import {fromPromise} from 'most'
import {fromJS} from 'immutable'

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
export const getFX$ = currency => fromPromise(fetchFX(currency).run().promise().then(data => fromJS(data.rates)))
export const getPartialInvestment$ = () => fromPromise(fetchPartialInvestments.run().promise())

export const getPriceObjFromStreamData = data => ({
  price: data.PRICE || 0,
  market: data.MARKET,
  symbol: data.FROMSYMBOL
})

