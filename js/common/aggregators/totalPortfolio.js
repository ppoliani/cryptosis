const {fromJS} = require('immutable');
const {
   calculateCurrentValuePerType,
   calculateExposure,
   calculateTotalCash,
   calculatePortfolioTotalQtyPerType,
   calculateTotalAmountInvested
} = require('./common');

const calculateTotalPortfolioValue = ({investments, fx}) => {
  return fromJS({
    totalExposure: calculateExposure(investments),
    totalInvested: calculateTotalAmountInvested(investments),
    currentValue: calculateCurrentValuePerType(investments, fx),
    totalCash: calculateTotalCash(investments),
    qty: calculatePortfolioTotalQtyPerType(investments)
  });
};

module.exports = {calculateTotalPortfolioValue};
