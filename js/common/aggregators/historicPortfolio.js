const {fromJS, Map} = require('immutable');
const {noop} = require('../core/fn');
const {
  getChangeAfterDate,
  getCashAfterDate,
  getTotalValueAfterDate
} = require('./common');

// Gets all prices for the last 30 days for the given symbol i.e. ETH
// and returns the portfolio values for each day
// i.e. Price[] Investment[Id, Investment] Symbol -> {day, value}
const getPortfolioValueForSymbol = (priceList, investments, symbol) =>
  priceList.map(p => {
    const {day, price} = p.toJS();

    return fromJS({
      day,
      value: {
        change: getChangeAfterDate(investments, symbol, day, price),
        cash: getCashAfterDate(investments, symbol, day),
        totalValue: getTotalValueAfterDate(investments, symbol, day, price)
      }
    })
  })

// returns a Map with keys for each symbol and the entries
// for each day as well as the portfolio value on that date
// e.g. {[id]: Investment} {ETH: Price[]} -> { ETH: [{day: 123, value: 2000}], BTC:  [{day: 123, value: 2000}]}
const calculateHistoricPortfolioValues = ({investments, prices}) => {
  const historicValues = prices.reduce(
    (acc, priceList, symbol) => acc.set(
      symbol,
      getPortfolioValueForSymbol(priceList, investments, symbol),
    ),
    Map()
  )

  return historicValues;
};

module.exports = {calculateHistoricPortfolioValues};
