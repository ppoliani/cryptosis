const {fromJS} = require('immutable');
const {create} = require('@most/create');
const {
   calculateCurrentValuePerType,
   calculateNetCost,
   calculateTotalCash,
   calculatePortfolioTotalQtyPerType,
   calculateTotalAmountInvested
} = require('./common');

const calculateTotalPortfolioValue = ({investments, prices}) =>
  create((add, end, error) => {
    add(fromJS({
      totalExposure: calculateNetCost(investments),
      totalInvested: calculateTotalAmountInvested(investments),
      currentValue: calculateCurrentValuePerType(investments, prices),
      totalCash: calculateTotalCash(investments),
      qty: calculatePortfolioTotalQtyPerType(investments)
    }));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });

module.exports = {calculateTotalPortfolioValue};
