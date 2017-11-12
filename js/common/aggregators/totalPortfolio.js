const {fromJS} = require('immutable');
const {calculateHoldings, calculateExposure} = require('./holdings')
const {calculateHoldingsValue, calculatePorfolioExposure} = require('./portfolioValue')

const calculateTotalPortfolioValue = ({transactions, fx}) => {
  const holdings = calculateHoldings(transactions);
  const exposureHoldings = calculateExposure(transactions, fx);

  return fromJS({
    holdings,
    exposure: {...calculatePorfolioExposure(exposureHoldings, fx)},
    value: {...calculateHoldingsValue(holdings, fx)}
  });
}


module.exports = {calculateTotalPortfolioValue};
