import {fromJS, Map} from 'immutable';
import {create} from '@most/create'
import curry from 'folktale/core/lambda/curry';
import compose from 'folktale/core/lambda/compose'
import {partial} from '../../helpers/fn';
import {getTotalForInvestment, getCurrentTotalForInvestment, getPercentageChange} from './common';


const getInvestmentValue = curry(2, (currentPrice, investment) => {
  const investmentValue = getTotalForInvestment(investment);
  const diff = getCurrentTotalForInvestment(investment, currentPrice) - investmentValue;

  return Map({
    value: diff,
    percentage: getPercentageChange(diff, investmentValue)
  });
});

const getCurrentPrice = (prices, investment) => prices.getIn([investment.get('investmentType'), 'price']);

export const calculateInvestmentValues = ({investments, prices}) =>
  create((add, end, error) => {
    add(investments.map(
      investment => compose(getInvestmentValue, partial(getCurrentPrice, prices))(investment)(investment)
    ));
    end();

    return () => console.log('Unsubscribe calculateInvestmentValues');
  });
