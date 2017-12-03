const {fromJS, Map} = require('immutable')
const {partial} = require('../core/fn')
const {getTxnsOnDate} = require('./utils')
const {getTotalValueForTheGivenPrice, calculateCapitalGainForTheGivenPrice} = require('./portfolioValue')

// Gets all prices for the last 30 days for the given asset i.e. ETH
// and returns the portfolio values for each day
// i.e. Price[] Transaction[Id, Transaction] Asset -> {day, value}
const getPortfolioValueForAsset = (priceList, txns, asset) =>
  priceList.map(p => {
    const {day, price} = p.toJS();
    const txnOnDay = getTxnsOnDate(txns, asset, day);

    return fromJS({
      day,
      value: {
        capitalGain: calculateCapitalGainForTheGivenPrice(txnOnDay, asset, price),
        totalValue: getTotalValueForTheGivenPrice(txnOnDay, asset, price)
      }
    }) 
  })

// return Map<asset, assetDayValue>
// where assetDayValue: { day: Number, value: { capitalGain: Number, totalValue: Number } }
const calculateHistoricPortfolioValues = ({txns, prices}) => 
  prices.reduce(
    (acc, priceList, asset) => acc.set(
      asset,
      getPortfolioValueForAsset(priceList, txns, asset),
    ),
    Map()
  )

module.exports = {calculateHistoricPortfolioValues}
