getTotalExposure = portfolio =>
  portfolio
    .get('total')
    .matchWith({
      Just: ({value: total}) => Math.floor(total.get('totalExposure').reduce((acc, v) => acc + v, 0)),
      Nothing: () => 0
    })

getTotalPortfolioValue = portfolio =>
  portfolio
    .get('total')
    .matchWith({
      Just: ({value: total}) => Math.floor(total.get('currentValue').reduce((acc, v) => acc + v, 0)),
      Nothing: () => 0
    })

getTotalCash = portfolio =>
  portfolio
    .get('total')
    .matchWith({
      Just: ({value: total}) => Math.floor(total.get('totalCash').reduce((acc, v) => acc + v, 0)),
      Nothing: () => 0
    })

getTotalInvested = portfolio =>
  portfolio
    .get('total')
    .matchWith({
      Just: ({value: total}) => Math.floor(total.get('totalInvested').reduce((acc, v) => acc + v, 0)),
      Nothing: () => 0
    })


module.exports = {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested
};
