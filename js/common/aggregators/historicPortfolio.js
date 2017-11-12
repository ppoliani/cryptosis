const {fromJS, Map} = require('immutable')
const {partial} = require('../core/fn')
const {isOfType, isBeforeDate} = require('./utils')
const {getTotalValueForTheGivenPrice} = require('./portfolioValue')

const getTxnsOnDate = (txns, day) => txns.filter(partial(isBeforeDate, day))

// Gets all prices for the last 30 days for the given asset i.e. ETH
// and returns the portfolio values for each day
// i.e. Price[] Transaction[Id, Transaction] Asset -> {day, value}
const getPortfolioValueForAsset = (priceList, txns, asset) =>
  priceList.map(p => {
    const {day, price} = p.toJS();

    return fromJS({
      day,
      value: {
        // change: getChangeAfterDate(txns, asset, day, price),
        // cash: getCashAfterDate(txns, asset, day),
        totalValue: getTotalValueForTheGivenPrice(
          getTxnsOnDate(txns, day), 
          asset, 
          price
        )
      }
    })
  })

// returns a Map with keys for each asset and the entries
// for each day as well as the portfolio value on that date
// e.g. {[id]: Transaction} {ETH: Price[]} -> { ETH: [{day: 123, value: 2000}], BTC:  [{day: 123, value: 2000}]}
const calculateHistoricPortfolioValues = ({txns, prices}) => prices.reduce(
  (acc, priceList, asset) => acc.set(
    asset,
    getPortfolioValueForAsset(priceList, txns, asset),
  ),
  Map()
)

module.exports = {calculateHistoricPortfolioValues}
