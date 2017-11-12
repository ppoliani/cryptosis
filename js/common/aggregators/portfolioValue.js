const {fromJS} = require('immutable')
const {calculateHoldings} = require('./holdings')

const calculateAssetValue = fx => (amount, asset) => amount * fx.getIn([asset, 'price']);
const aggregateAssetValues = (total, assetValue) => total + assetValue;

// Calculate the portfolio for each asset and for all of them in total.
// The value is measured in the current currency selected by the user e.g. GBP, USD or EUR
// fx will contain the fx exchanges against the selected currency
const calculatePortfolioValue = (holdings, fx) => {
  const assetValues = holdings.map(calculateAssetValue(fx));
  const totalValue = assetValues.reduce(aggregateAssetValues, 0);

  return {assetValues, totalValue};
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

  return portfolioValue.assetValues.get(asset, 0);
}

// Capital gain/loss is the Sum of fiat currencies holdings
const calculateCapitalGain = (holdings, fx) => {
  const fiatHoldings = holdings.filter((_, asset) => ['GBP', 'USD', 'EUR'].includes(asset));
  return calculatePortfolioValue(fiatHoldings, fx);
}

module.exports = {
  calculatePortfolioValue,
  getTotalValueForTheGivenPrice,
  calculateCapitalGain
}
