const {fromJS} = require('immutable');
const {
   calculateCurrentValuePerType,
   calculateExposure,
   calculateTotalCash,
   calculatePortfolioTotalQtyPerType,
   calculateTotalAmountInvested
} = require('./common');

const calculateTotalPortfolioValue = ({investments, prices}) => {
  const longTermInvestments = investments.filter(i => i.get('assetLife') === 'Long Term');
  const shortTermInvestments = investments.filter(i => i.get('assetLife') === 'Short Term');

  return fromJS({
    longTerm: {
      totalExposure: calculateExposure(longTermInvestments),
      totalInvested: calculateTotalAmountInvested(longTermInvestments),
      currentValue: calculateCurrentValuePerType(longTermInvestments, prices),
      totalCash: calculateTotalCash(longTermInvestments),
      qty: calculatePortfolioTotalQtyPerType(longTermInvestments)
    },
    shortTerm: {
      totalExposure: calculateExposure(shortTermInvestments),
      totalInvested: calculateTotalAmountInvested(shortTermInvestments),
      currentValue: calculateCurrentValuePerType(shortTermInvestments, prices),
      totalCash: calculateTotalCash(shortTermInvestments),
      qty: calculatePortfolioTotalQtyPerType(shortTermInvestments)
    }
  });
};

module.exports = {calculateTotalPortfolioValue};
