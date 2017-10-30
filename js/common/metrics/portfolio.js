const getTotalExposure = portfolio => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) => total.get('totalExposure').reduce((acc, v) => acc + v, 0),
    Nothing: () => 0
  })

const getTotalPortfolioValue = portfolio => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) => total.get('currentValue').reduce((acc, v) => acc + v, 0),
    Nothing: () => 0
  })

const getTotalCash = portfolio => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) => total.get('totalCash').reduce((acc, v) => acc + v, 0),
    Nothing: () => 0
  })

const getTotalInvested = portfolio => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) => total.get('totalInvested').reduce((acc, v) => acc + v, 0),
    Nothing: () => 0
  })

const getTotalCashForType = (portfolio, investmentType) => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) =>
      total
        .get('totalCash')
        .filter((v, k) => k === investmentType)
        .reduce((acc, v) => acc + v, 0),
    Nothing: () => 0
  })

const getQtyForType = (portfolio, investmentType) => portfolio
  .get('total')
  .matchWith({
    Just: ({value: total}) => total.getIn(['qty', investmentType]),
    Nothing: () => 0
  })

const getCapitalGain = portfolio => {
  const totalaValue = getTotalPortfolioValue(portfolio);
  const totalCash = getTotalCash(portfolio);
  const totalInvested = getTotalInvested(portfolio);  
  const capitalGain = totalaValue + totalCash - totalInvested;
  const capitalGainPercentage = capitalGain / totalInvested;

  return [capitalGain, capitalGainPercentage];
}

module.exports = {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested,
  getTotalCashForType,
  getQtyForType, 
  getCapitalGain
};
