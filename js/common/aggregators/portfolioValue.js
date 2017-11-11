const calculateAssetValue = fx => (amount, asset) => amount * fx.getIn([asset, 'price']);
const aggregateAssetValues = (total, assetValue) => total + assetValue;

const calculatePortfolioValue = (holdings, fx) => {
  const assetsValues = holdings.map(calculateAssetValue(fx));
  const totalValue = assetsValues.reduce(aggregateAssetValues, 0);

  return {assetsValues, totalValue};
}

module.exports = {
  calculatePortfolioValue
}
