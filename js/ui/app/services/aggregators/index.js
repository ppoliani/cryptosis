import {Map, fromJS} from 'immutable';
import {create} from '@most/create'
import {async, Subject} from 'most-subject';

const getTotalForInvestment = i => i.get('price') * i.get('quantity');

const calculateTotalPerType = investments =>
  investments.reduce(
    (acc, v) => acc.update(
      v.get('investmentType'),
      0,
      sum => sum + getTotalForInvestment(v)
    ),
    Map()
  )

const getCurrentTotalForInvestment = (investment, currentPrice) => investment.get('quantity') * currentPrice;

const calculateCurrentValuePerType = (investments, prices) =>
  investments.reduce(
    (acc, v) => {
      const type = v.get('investmentType');
      return acc.update(
        type,
        0,
        sum => sum + getCurrentTotalForInvestment(v, prices[type].price)
      )
    },
    Map()
  )

export const calculateTotalPortfolioValue = ({investments, prices}) => {
  return create((add, end, error) => {
    // calculate total portfolio value
    add(fromJS({
      totalAssets: calculateTotalPerType(investments),
      currentValue: calculateCurrentValuePerType(investments, prices)
    }));

    end();

    return () => console.log('Unsubscribe');
  });
}
