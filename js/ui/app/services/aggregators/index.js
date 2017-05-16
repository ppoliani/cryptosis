import {Map} from 'immutable';
import {create} from '@most/create'
import {async, Subject} from 'most-subject';

const getTotalForInvestment = i => i.get('price') * i.get('quantity');

const calculateTotalPerType = investments => {
  return investments.reduce(
    (acc, v) => {
      return acc.update(
        v.get('investmentType'),
        0,
        sum => sum + getTotalForInvestment(v)
      )
    },
    Map()
  );
}

export const calculateTotalPortfolioValue = ({investments, prices}) => {
  return create((add, end, error) => {
    // calculate total portfolio value
    console.log(calculateTotalPerType(investments).toJS());
    add(12300);
    end();

    return () => console.log('Unsubscribe');
  });
}
