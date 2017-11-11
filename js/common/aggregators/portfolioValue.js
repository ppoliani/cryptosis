const calculateAssetValue = fx => (amount, asset) => amount * fx.getIn([asset, 'price']);
const aggregateAssetValues = (total, assetValue) => total + assetValue;

const calculatePortfolioValue = (holdings, fx) => holdings
  .map(calculateAssetValue(fx))
  .reduce(aggregateAssetValues, 0);

module.exports = {
  calculatePortfolioValue
}
