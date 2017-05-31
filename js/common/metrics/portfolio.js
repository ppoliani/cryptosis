const getTotalExposure = (portfolio, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) => total.get('totalExposure').reduce((acc, v) => acc + v, 0),
      Nothing: () => 0
    })

const getTotalPortfolioValue = (portfolio, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) => total.get('currentValue').reduce((acc, v) => acc + v, 0),
      Nothing: () => 0
    })

const getTotalCash = (portfolio, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) => total.get('totalCash').reduce((acc, v) => acc + v, 0),
      Nothing: () => 0
    })

const getTotalInvested = (portfolio, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) => total.get('totalInvested').reduce((acc, v) => acc + v, 0),
      Nothing: () => 0
    })

const getTotalCashForType = (portfolio, investmentType, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) =>
        total
          .get('totalCash')
          .filter((v, k) => k === investmentType)
          .reduce((acc, v) => acc + v, 0),
      Nothing: () => 0
    })

const getQtyForType = (portfolio, investmentType, assetLife) =>
  portfolio
    .getIn(['total', assetLife])
    .matchWith({
      Just: ({value: total}) => total.getIn(['qty', investmentType]),
      Nothing: () => 0
    })

module.exports = {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested,
  getTotalCashForType,
  getQtyForType
};
