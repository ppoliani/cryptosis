const {fromJS} = require('immutable');
const {create} = require('@most/create');
const {
   calculateCurrentValuePerType,
   calculateNetCost,
   calculateTotalCash
} = require('./common');

const calculateTotalPortfolioValue = ({investments, prices}) =>
  create((add, end, error) => {
    add(fromJS({
      totalAssets: calculateNetCost(investments),
      currentValue: calculateCurrentValuePerType(investments, prices),
      totalCash: calculateTotalCash(investments)
    }));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });

module.exports = {calculateTotalPortfolioValue};
