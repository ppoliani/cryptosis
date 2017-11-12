const {fromJS} = require('immutable')
const {calculateHoldings} = require('./holdings')

const calculateAssetValue = fx => (amount, asset) => amount * fx.getIn([asset, 'price']);
const aggregateAssetValues = (total, assetValue) => total + assetValue;

const calculatePortfolioValue = (holdings, fx) => {
  const assetsValues = holdings.map(calculateAssetValue(fx));
  const totalValue = assetsValues.reduce(aggregateAssetValues, 0);

  return {assetsValues, totalValue};
}

const wrapPriceInFxInterface = (price, asset) => fromJS({
  [asset]: {price}
})

// Txns will include the txns on a specific day with priceOfday being the price at that time
const getTotalValueForTheGivenPrice = (txns, asset, priceOfDay) => {
  const holdingsOfTheDay = calculateHoldings(txns);
  const portfolioValue = calculatePortfolioValue(
    holdingsOfTheDay, 
    wrapPriceInFxInterface(priceOfDay, asset)
  );

  return portfolioValue.assetsValues.get(asset, 0);
}


module.exports = {
  calculatePortfolioValue,
  getTotalValueForTheGivenPrice
}
