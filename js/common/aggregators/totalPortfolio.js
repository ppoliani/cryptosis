const {fromJS} = require('immutable');
const {create} = require('@most/create');
const {calculateTotalPerType, calculateCurrentValuePerType, calculateNetCost} = require('./common');

const calculateTotalPortfolioValue = ({investments, prices}) =>
  create((add, end, error) => {
    add(fromJS({
      totalAssets: calculateNetCost(investments),
      currentValue: calculateCurrentValuePerType(investments, prices)
    }));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });

module.exports = {calculateTotalPortfolioValue};
