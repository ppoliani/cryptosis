const {calculatePercentageChange} = require('../aggregators/utils')

const getHoldingsForAsset = (portfolio, asset) => portfolio.getIn(['holdings', asset], 0);
const getAssetCurrentValue = (portfolio, asset) => portfolio.getIn(['value', 'assetValues', asset], 0);
const getAssetExposure = (portfolio, asset) => portfolio.getIn(['exposure', 'assetExposure', asset], 0);
const getAssetCapitalGain = (portfolio, asset) => portfolio.getIn(['capitalGain', 'assetValues', asset], 0);

const getAssetMetrics = (portfolio, asset) => {
  const holdings = getHoldingsForAsset(portfolio, asset);
  const assetValue = getAssetCurrentValue(portfolio, asset);
  const exposure = getAssetExposure(portfolio, asset);
  const capitalGain = getAssetCapitalGain(portfolio, asset);
  const percChange = calculatePercentageChange(exposure, capitalGain);

  return {
    holdings,
    assetValue,
    exposure,
    capitalGain,
    percChange
  }
}

module.exports = {
  getAssetMetrics
}
