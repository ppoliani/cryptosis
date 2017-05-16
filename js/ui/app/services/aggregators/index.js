import {create} from '@most/create'
import {async, Subject} from 'most-subject';

export const calculateTotalPortfolioValue = ({investments, prices}) => {
  return create((add, end, error) => {
    // calculate total portfolio value
    console.log(investments.toJS())
    add(12300);
    end();

    return () => console.log('Unsubscribe');
  });
}
