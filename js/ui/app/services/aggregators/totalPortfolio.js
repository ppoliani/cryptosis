import {fromJS} from 'immutable';
import {create} from '@most/create'
import {calculateTotalPerType, calculateCurrentValuePerType} from './common';

export const calculateTotalPortfolioValue = ({investments, prices}) =>
  create((add, end, error) => {
    add(fromJS({
      totalAssets: calculateTotalPerType(investments),
      currentValue: calculateCurrentValuePerType(investments, prices)
    }));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });
